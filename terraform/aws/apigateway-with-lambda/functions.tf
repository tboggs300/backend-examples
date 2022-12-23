resource "random_uuid" "archive" {}

data "archive_file" "lambda_function_source" {
  type        = "zip"
  source_dir  = var.path_to_lambda_folder
  output_path = "${var.path_to_lambda_folder}-tf-handler-${random_uuid.archive.result}.zip"
}

# Upload Lamda function to S3
resource "aws_s3_bucket_object" "function_storage_upload" {
  bucket = var.bucket_id
  key    = "lambdas/${var.lambda_folder_name}-tf-handler.zip"
  source = data.archive_file.lambda_function_source.output_path
  etag   = filemd5(data.archive_file.lambda_function_source.output_path)
}

# Lamda Initialization
resource "aws_lambda_function" "function_handler" {
  function_name = var.function_name
  description   = "${var.aws_profile}: ${var.function_description}"
  s3_bucket     = var.bucket_id
  s3_key        = aws_s3_bucket_object.function_storage_upload.key

  # Entrypoint to lambda function. Format is <file-name>.<property-name>
  handler = "index.handler"
  runtime = var.lambda_runtime
  timeout = var.timeout

  # IAM role for lambda defined below
  role             = var.default_lambda_role_arn
  publish          = true
  source_code_hash = filebase64sha256(data.archive_file.lambda_function_source.output_path)

}

# Give permission to the API gateway to access this lambda
resource "aws_lambda_permission" "lambda_permission_for_api_gateway" {
  # Name of lambda from above
  function_name = aws_lambda_function.function_handler.arn
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"

  # Link to execution arn of API Gateway REST API
  # The "/*/*" portion grants access to any method, any resource within API Gateway
  source_arn = "${var.api_gateway_arn}/*/*"
}
