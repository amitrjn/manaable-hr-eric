import * as cdk from 'aws-cdk-lib';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { Construct } from 'constructs';

interface PipelineStackProps extends cdk.StackProps {
  prefix: string;
}

export class ChakoPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    // Create artifact bucket
    const artifactBucket = new cdk.aws_s3.Bucket(this, `${props.prefix}-artifacts`, {
      bucketName: `${props.prefix}-pipeline-artifacts`,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      encryption: cdk.aws_s3.BucketEncryption.S3_MANAGED,
    });

    // Create pipeline
    const pipeline = new codepipeline.Pipeline(this, `${props.prefix}-pipeline`, {
      pipelineName: `${props.prefix}-pipeline`,
      artifactBucket,
    });

    // Source stage
    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: 'GitHub_Source',
      owner: 'amitrjn',
      repo: 'manaable-hr-eric',
      branch: 'main',
      oauthToken: cdk.SecretValue.secretsManager('github-token'),
      output: sourceOutput,
    });

    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction],
    });

    // Build frontend
    const frontendBuild = new codebuild.PipelineProject(this, `${props.prefix}-frontend-build`, {
      projectName: `${props.prefix}-frontend-build`,
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: [
              'cd frontend',
              'npm ci',
            ],
          },
          build: {
            commands: [
              'npm run build',
            ],
          },
        },
        artifacts: {
          'base-directory': 'frontend/dist',
          files: ['**/*'],
        },
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
      },
    });

    const frontendBuildOutput = new codepipeline.Artifact('FrontendBuildOutput');
    const frontendBuildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'Build_Frontend',
      project: frontendBuild,
      input: sourceOutput,
      outputs: [frontendBuildOutput],
    });

    // Build backend
    const backendBuild = new codebuild.PipelineProject(this, `${props.prefix}-backend-build`, {
      projectName: `${props.prefix}-backend-build`,
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: [
              'cd backend',
              'python -m pip install --upgrade pip',
              'pip install -r api/requirements.txt -r auth/requirements.txt',
            ],
          },
          build: {
            commands: [
              'python -m pytest',
              'python -m black --check .',
              'python -m pylint **/*.py',
            ],
          },
        },
        artifacts: {
          'base-directory': 'backend',
          files: ['**/*.py', 'requirements.txt'],
        },
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
      },
    });

    const backendBuildOutput = new codepipeline.Artifact('BackendBuildOutput');
    const backendBuildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'Build_Backend',
      project: backendBuild,
      input: sourceOutput,
      outputs: [backendBuildOutput],
    });

    pipeline.addStage({
      stageName: 'Build',
      actions: [frontendBuildAction, backendBuildAction],
    });

    // Deploy stage
    const deployBuild = new codebuild.PipelineProject(this, `${props.prefix}-deploy`, {
      projectName: `${props.prefix}-deploy`,
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: [
              'cd infrastructure',
              'npm ci',
            ],
          },
          build: {
            commands: [
              'npm run cdk deploy -- --require-approval never',
            ],
          },
        },
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        privileged: true,
      },
    });

    const deployAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'Deploy',
      project: deployBuild,
      input: sourceOutput,
      extraInputs: [frontendBuildOutput, backendBuildOutput],
    });

    pipeline.addStage({
      stageName: 'Deploy',
      actions: [deployAction],
    });

    // Grant necessary permissions
    deployBuild.addToRolePolicy(new cdk.aws_iam.PolicyStatement({
      actions: ['cloudformation:*', 's3:*', 'iam:*', 'lambda:*', 'apigateway:*'],
      resources: ['*'],
    }));
  }
}
