# Instructions for setting up Lambda function with trigger

Reference: [Tutorial: Using an Amazon S3 trigger to invoke a Lambda function](https://docs.aws.amazon.com/lambda/latest/dg/with-s3-example.html)

## Create IAM policy

An IAM policy needs to be created to allow the necessary actions.

In AWS console: **IAM** &rarr; **Policies**

The Policy is a JSON object with two fields (Version must be set to this--this isn't a "date"):

    {
      "Version": "2012-10-17",
      "Statement": []
    }

We add access by adding objects to the **Statement** array field.

### Allow logging

We must allow the Lambda function to produce logs to CloudWatch.

_I suggest limiting the retention of logs after the log group is created._

    {
      "Sid": "AllowLogging",
      "Effect": "Allow",
      "Action": [
        "logs:PutLogEvents",
        "logs:CreateLogGroup",
        "logs:CreateLogStream"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }

### Allow reading from source

You need to be able to get any object in your source location (directory/folder).

    {
      "Sid": "AllowReadCsv",
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::<bucket>/<path-to-csv-source>/*"
    }

### Allow writing to destination and Modify ACL

You need to be able to:
* put an object (to write to S3)
* modify the ACL to public (to be able to access the output from internet)

        {
            "Sid": "AllowWriteToJson",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl"
                ],
            "Resource": "arn:aws:s3:::<bucket>/<path-to-json-output>/*"
        }

# Create IAM Role

Just create new role and add the above policy:
1. Choose use case **Lambda**
2. Add above policy
3. Name the role

# Create Lambda function

 _**Note that the lambda function must be in the same AWS region as the bucket/s it's accessing!!!**_

1. Choose _Author from Scratch_
2. Give a name
3. Choose Python Runtime (Python 3.11 was used)
4. Change default execution role to one created above
5. Copy (or upload) Lambda Function to console and Deploy (to save lambda function)

# Create S3 trigger

While in the Lambda function console, choose to add trigger:

1. Choose S3 trigger
2. set the bucket
3. add a prefix to your source files
    * _**this is important to limit what triggers the lambda function!!!**_
5. Choose **All object create events** under Event Types

You have to then ackowledge that it's possible that you could create an endless loop of calls: if you listen for a change, then create a change (by writing to the place you're also listening), you will then hear a change, and write again, creating another change, thus another write, ad nauseum.

_**Make sure IAM policy only allows writes to the write location and that the read location is specified in the prefix for the S3 trigger**_
