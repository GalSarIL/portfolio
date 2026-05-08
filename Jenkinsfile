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

        stage('Smoke Test') {
            steps {
                script {
                    sleep(10)
                    def code = sh(
                        script: 'curl -s -o /dev/null -w "%{http_code}" --max-time 15 https://galsaril.com',
                        returnStdout: true
                    ).trim()
                    if (code != '200') {
                        error("Smoke test failed: got HTTP ${code}")
                    }
                    def body = sh(
                        script: 'curl -s --max-time 15 https://galsaril.com',
                        returnStdout: true
                    )
                    if (!body.contains('Gal Sar Israel')) {
                        error('Smoke test failed: expected content not found')
                    }
                    echo "Smoke test passed: site is up and content is valid"
                }
            }
        }
    }

    post {
        success {
            echo 'Deployed and verified galsaril.com'
        }
        failure {
            echo 'Pipeline failed - check deploy or smoke test output'
        }
    }
}
