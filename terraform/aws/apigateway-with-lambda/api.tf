resource "aws_api_gateway_method" "gateway_method" {
  rest_api_id      = var.api_gateway_id
  resource_id      = var.target_api_resource_id
  http_method      = var.method_type
  authorization    = "NONE"
  api_key_required = var.api_key_required
}

resource "aws_api_gateway_integration" "gateway_api_integration" {
  # ID of the REST API and the endpoint at which to integrate a lambda function
  rest_api_id = var.api_gateway_id
  resource_id = var.target_api_resource_id

  # ID of the HTTP method at which to integrate with the lambda function
  http_method = aws_api_gateway_method.gateway_method.http_method

  # Lambdas can only be invoked via HTTP POST
  integration_http_method = "POST"
  type                    = "AWS_PROXY"

  # The URI at which the API is invoked
  uri = aws_lambda_function.function_handler.invoke_arn
}
