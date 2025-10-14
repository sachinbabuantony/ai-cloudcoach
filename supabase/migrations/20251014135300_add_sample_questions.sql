/*
  # Add Sample Questions for Testing

  ## Overview
  This migration adds sample cloud certification questions for AWS, Azure, and Google Cloud
  to enable immediate testing of the learning platform.

  ## Changes
  - Inserts 30 approved questions across different certifications
  - Covers various topics and difficulty levels
  - Includes detailed explanations for each question

  ## Sample Data
  - 15 AWS questions (Solutions Architect Associate)
  - 10 Azure questions (Fundamentals)
  - 5 Google Cloud questions (Associate Cloud Engineer)
*/

-- AWS Solutions Architect Associate Questions
INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'What is the primary benefit of using Amazon S3 for storage?',
  'Block-level storage for databases',
  'Object storage with high durability and availability',
  'File system storage for EC2 instances',
  'Temporary storage for Lambda functions',
  'B',
  'Amazon S3 provides object storage with 99.999999999% (11 9s) durability and high availability, making it ideal for storing and retrieving any amount of data at any time.',
  2,
  'Storage',
  true
FROM certifications WHERE code = 'AWS-SAA' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'Which AWS service provides a managed relational database?',
  'DynamoDB',
  'ElastiCache',
  'Amazon RDS',
  'Amazon Redshift',
  'C',
  'Amazon RDS (Relational Database Service) is a managed service that makes it easy to set up, operate, and scale relational databases in the cloud. It supports multiple database engines including MySQL, PostgreSQL, Oracle, and SQL Server.',
  1,
  'Database',
  true
FROM certifications WHERE code = 'AWS-SAA' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'What is the purpose of an AWS VPC?',
  'To store virtual machine images',
  'To provide isolated network environments in the cloud',
  'To manage user authentication',
  'To cache frequently accessed data',
  'B',
  'Amazon VPC (Virtual Private Cloud) lets you provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define.',
  2,
  'Networking',
  true
FROM certifications WHERE code = 'AWS-SAA' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'Which service would you use to distribute content globally with low latency?',
  'Amazon S3',
  'Amazon CloudFront',
  'AWS Direct Connect',
  'Amazon Route 53',
  'B',
  'Amazon CloudFront is a content delivery network (CDN) service that securely delivers data, videos, applications, and APIs to customers globally with low latency and high transfer speeds.',
  2,
  'Content Delivery',
  true
FROM certifications WHERE code = 'AWS-SAA' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'What is AWS Lambda primarily used for?',
  'Running containerized applications',
  'Hosting static websites',
  'Running code without provisioning servers',
  'Managing DNS records',
  'C',
  'AWS Lambda is a serverless compute service that lets you run code without provisioning or managing servers. You pay only for the compute time you consume.',
  1,
  'Compute',
  true
FROM certifications WHERE code = 'AWS-SAA' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'Which AWS service provides DNS services?',
  'AWS Direct Connect',
  'Amazon Route 53',
  'Amazon CloudFront',
  'AWS Global Accelerator',
  'B',
  'Amazon Route 53 is a highly available and scalable Domain Name System (DNS) web service that routes end users to internet applications.',
  1,
  'Networking',
  true
FROM certifications WHERE code = 'AWS-SAA' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'What is the recommended way to secure access to AWS resources?',
  'Share root account credentials',
  'Use IAM users and roles with least privilege',
  'Allow public access to all resources',
  'Use a single admin user for all operations',
  'B',
  'AWS recommends using IAM (Identity and Access Management) users and roles with the principle of least privilege, granting only the permissions required to perform a task.',
  2,
  'Security',
  true
FROM certifications WHERE code = 'AWS-SAA' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'Which service provides automatic scaling for EC2 instances?',
  'AWS Lambda',
  'Amazon ECS',
  'AWS Auto Scaling',
  'Amazon Lightsail',
  'C',
  'AWS Auto Scaling monitors your applications and automatically adjusts capacity to maintain steady, predictable performance at the lowest possible cost.',
  2,
  'Compute',
  true
FROM certifications WHERE code = 'AWS-SAA' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'What is Amazon DynamoDB?',
  'A relational database service',
  'A NoSQL database service',
  'A data warehouse service',
  'A caching service',
  'B',
  'Amazon DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance with seamless scalability.',
  1,
  'Database',
  true
FROM certifications WHERE code = 'AWS-SAA' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'Which service should you use for sending emails from your application?',
  'Amazon SNS',
  'Amazon SQS',
  'Amazon SES',
  'Amazon CloudWatch',
  'C',
  'Amazon SES (Simple Email Service) is a cloud-based email sending service designed to help digital marketers and application developers send marketing, notification, and transactional emails.',
  2,
  'Application Integration',
  true
FROM certifications WHERE code = 'AWS-SAA' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'What is the purpose of Amazon CloudWatch?',
  'To monitor and observe AWS resources and applications',
  'To deploy applications automatically',
  'To manage user permissions',
  'To store backup data',
  'A',
  'Amazon CloudWatch is a monitoring and observability service that provides data and actionable insights for AWS resources and applications.',
  2,
  'Monitoring',
  true
FROM certifications WHERE code = 'AWS-SAA' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'Which storage class in S3 is most cost-effective for infrequently accessed data?',
  'S3 Standard',
  'S3 Intelligent-Tiering',
  'S3 Glacier',
  'S3 One Zone-IA',
  'C',
  'S3 Glacier is designed for data archiving and long-term backup, providing the lowest cost storage for data that is rarely accessed.',
  3,
  'Storage',
  true
FROM certifications WHERE code = 'AWS-SAA' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'What is AWS Elastic Beanstalk?',
  'A container orchestration service',
  'A platform service for deploying and scaling web applications',
  'A database migration tool',
  'A load balancing service',
  'B',
  'AWS Elastic Beanstalk is an easy-to-use service for deploying and scaling web applications. You simply upload your code and Elastic Beanstalk handles deployment, capacity provisioning, load balancing, and auto-scaling.',
  2,
  'Compute',
  true
FROM certifications WHERE code = 'AWS-SAA' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'Which service provides a fully managed message queuing service?',
  'Amazon SNS',
  'Amazon SQS',
  'Amazon MQ',
  'AWS Step Functions',
  'B',
  'Amazon SQS (Simple Queue Service) is a fully managed message queuing service that enables you to decouple and scale microservices, distributed systems, and serverless applications.',
  2,
  'Application Integration',
  true
FROM certifications WHERE code = 'AWS-SAA' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'What is Amazon ECS used for?',
  'Managing email campaigns',
  'Running containerized applications',
  'Storing object data',
  'Creating virtual networks',
  'B',
  'Amazon ECS (Elastic Container Service) is a fully managed container orchestration service that makes it easy to deploy, manage, and scale containerized applications.',
  3,
  'Compute',
  true
FROM certifications WHERE code = 'AWS-SAA' LIMIT 1;

-- Azure Fundamentals Questions
INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'What is Azure?',
  'A programming language',
  'A cloud computing platform by Microsoft',
  'An operating system',
  'A database management system',
  'B',
  'Microsoft Azure is a cloud computing platform and infrastructure created by Microsoft for building, deploying, and managing applications and services through a global network of datacenters.',
  1,
  'Cloud Concepts',
  true
FROM certifications WHERE code = 'AZ-900' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'Which Azure service provides virtual machines?',
  'Azure Storage',
  'Azure Virtual Machines',
  'Azure Functions',
  'Azure SQL Database',
  'B',
  'Azure Virtual Machines is an Azure service that provides on-demand, scalable computing resources, allowing you to create and use virtual machines in the cloud.',
  1,
  'Compute',
  true
FROM certifications WHERE code = 'AZ-900' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'What is Azure Blob Storage used for?',
  'Running virtual machines',
  'Storing unstructured data like documents and images',
  'Managing user identities',
  'Monitoring applications',
  'B',
  'Azure Blob Storage is optimized for storing massive amounts of unstructured data, such as text or binary data, including documents, media files, and backups.',
  2,
  'Storage',
  true
FROM certifications WHERE code = 'AZ-900' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'Which service provides serverless computing in Azure?',
  'Azure VM Scale Sets',
  'Azure Container Instances',
  'Azure Functions',
  'Azure Kubernetes Service',
  'C',
  'Azure Functions is a serverless compute service that lets you run event-triggered code without having to explicitly provision or manage infrastructure.',
  2,
  'Compute',
  true
FROM certifications WHERE code = 'AZ-900' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'What is Azure Active Directory?',
  'A file storage service',
  'An identity and access management service',
  'A virtual network service',
  'A database service',
  'B',
  'Azure Active Directory (Azure AD) is Microsoft cloud-based identity and access management service, which helps employees sign in and access resources.',
  2,
  'Identity',
  true
FROM certifications WHERE code = 'AZ-900' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'Which Azure service provides a content delivery network?',
  'Azure CDN',
  'Azure Traffic Manager',
  'Azure Front Door',
  'Azure Load Balancer',
  'A',
  'Azure CDN (Content Delivery Network) is a global CDN solution for delivering high-bandwidth content by caching content at strategically placed physical nodes across the world.',
  2,
  'Networking',
  true
FROM certifications WHERE code = 'AZ-900' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'What is the Azure pricing calculator used for?',
  'Monitoring resource usage',
  'Estimating the cost of Azure services',
  'Managing billing accounts',
  'Creating invoices',
  'B',
  'The Azure pricing calculator helps you estimate the cost of using Azure services by allowing you to configure and calculate the costs for your specific requirements.',
  1,
  'Cost Management',
  true
FROM certifications WHERE code = 'AZ-900' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'Which type of cloud model provides resources only for a single organization?',
  'Public cloud',
  'Private cloud',
  'Hybrid cloud',
  'Community cloud',
  'B',
  'A private cloud consists of computing resources used exclusively by one business or organization. It can be physically located at your organization on-site datacenter or hosted by a third-party service provider.',
  2,
  'Cloud Concepts',
  true
FROM certifications WHERE code = 'AZ-900' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'What is Azure Resource Manager?',
  'A deployment and management service for Azure',
  'A storage service',
  'A monitoring tool',
  'A database service',
  'A',
  'Azure Resource Manager is the deployment and management service for Azure. It provides a management layer that enables you to create, update, and delete resources in your Azure account.',
  2,
  'Management',
  true
FROM certifications WHERE code = 'AZ-900' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'Which Azure service provides monitoring and diagnostics?',
  'Azure Advisor',
  'Azure Monitor',
  'Azure Security Center',
  'Azure Policy',
  'B',
  'Azure Monitor maximizes the availability and performance of your applications and services by collecting, analyzing, and acting on telemetry from your cloud and on-premises environments.',
  2,
  'Monitoring',
  true
FROM certifications WHERE code = 'AZ-900' LIMIT 1;

-- Google Cloud Questions
INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'What is Google Cloud Platform (GCP)?',
  'A social media platform',
  'A suite of cloud computing services by Google',
  'A web browser',
  'A mobile operating system',
  'B',
  'Google Cloud Platform (GCP) is a suite of cloud computing services that runs on the same infrastructure that Google uses internally for its end-user products.',
  1,
  'Cloud Concepts',
  true
FROM certifications WHERE code = 'GCP-ACE' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'Which GCP service provides virtual machine instances?',
  'Cloud Storage',
  'Compute Engine',
  'Cloud Functions',
  'App Engine',
  'B',
  'Compute Engine is Google Cloud infrastructure as a service (IaaS) offering that provides virtual machines running in Google global data centers.',
  1,
  'Compute',
  true
FROM certifications WHERE code = 'GCP-ACE' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'What is Cloud Storage in GCP?',
  'A virtual machine service',
  'An object storage service',
  'A database service',
  'A networking service',
  'B',
  'Cloud Storage is a managed service for storing unstructured data. It provides worldwide storage and retrieval of any amount of data at any time.',
  1,
  'Storage',
  true
FROM certifications WHERE code = 'GCP-ACE' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'Which GCP service is used for serverless application development?',
  'Compute Engine',
  'Kubernetes Engine',
  'Cloud Functions',
  'Cloud SQL',
  'C',
  'Cloud Functions is a serverless execution environment for building and connecting cloud services. You write simple, single-purpose functions that respond to cloud events.',
  2,
  'Compute',
  true
FROM certifications WHERE code = 'GCP-ACE' LIMIT 1;

INSERT INTO questions (certification_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level, topic, approved) 
SELECT 
  id,
  'What is BigQuery?',
  'A virtual machine service',
  'A serverless data warehouse',
  'A container orchestration platform',
  'A load balancing service',
  'B',
  'BigQuery is Google Cloud serverless, highly scalable, and cost-effective multi-cloud data warehouse designed for business agility with built-in machine learning capabilities.',
  2,
  'Data Analytics',
  true
FROM certifications WHERE code = 'GCP-ACE' LIMIT 1;
