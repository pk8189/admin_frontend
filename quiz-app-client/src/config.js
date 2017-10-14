export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  cognito: {
    USER_POOL_ID : 'us-east-1_eV5e7RO12',
    APP_CLIENT_ID : 'e761rum926oc809egec2nh79f',
    REGION: 'us-east-1',
    IDENTITY_POOL_ID: 'us-east-1:ce027c8c-4341-4d96-94db-4783ab266f4d',
  },
  apiGateway: {
    URL: 'https://vh6jrkn4o6.execute-api.us-east-1.amazonaws.com/prod',
  },
  s3: {
  BUCKET: 'quiz-image-uploads',
  QUESTIONS: 'quiz-questions'
  },
};