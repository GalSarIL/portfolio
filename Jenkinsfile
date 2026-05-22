pipeline {
    agent any

    environment {
        CLOUDFLARE_API_TOKEN  = credentials('cloudflare-api-token')
        CLOUDFLARE_ACCOUNT_ID = credentials('cloudflare-account-id')
        SLACK_BOT_TOKEN       = credentials('slack-bot-token')
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
            script {
                def channel = env.BRANCH_NAME == 'main' ? 'jenkins-prod' : 'jenkins-dev'
                sh """curl -s -X POST "https://slack.com/api/chat.postMessage" -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" -H "Content-Type: application/json" --data '{"channel":"${channel}","text":":white_check_mark: *portfolio-deploy* passed — galsaril.com is live and verified."}'"""
            }
        }
        failure {
            script {
                def channel = env.BRANCH_NAME == 'main' ? 'jenkins-prod' : 'jenkins-dev'
                sh """curl -s -X POST "https://slack.com/api/chat.postMessage" -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" -H "Content-Type: application/json" --data '{"channel":"${channel}","text":":red_circle: *portfolio-deploy* FAILED — check Jenkins: http://localhost:8081/job/portfolio-deploy/"}'"""
            }
        }
    }
}
