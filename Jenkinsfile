pipeline {
    agent any

    environment {
        CLOUDFLARE_API_TOKEN  = credentials('cloudflare-api-token')
        CLOUDFLARE_ACCOUNT_ID = credentials('cloudflare-account-id')
    }

    triggers {
        pollSCM('* * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Deploy to Cloudflare') {
            steps {
                sh 'wrangler pages deploy site/ --project-name=galsaril --branch=main'
            }
        }
    }

    post {
        success {
            echo 'Deployed successfully to galsaril.com'
        }
        failure {
            echo 'Deployment failed - check Cloudflare API token and project name'
        }
    }
}
