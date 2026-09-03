import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger('ExceptionFilter')

	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse()

		const isHttpException = exception instanceof HttpException
		const status = isHttpException
			? exception.getStatus()
			: HttpStatus.INTERNAL_SERVER_ERROR
		const message = isHttpException
			? exception.getResponse()
			: 'Internal server error'

		if (!isHttpException) {
			const errorStack = exception instanceof Error ? exception.stack : ''
			this.logger.error(
				`Critical Infrastructure Failure: ${exception}`,
				errorStack,
			)
		}

		response.status(status).json(
			isHttpException && typeof message === 'object'
				? message
				: {
						statusCode: status,
						message,
					},
		)
	}
}
