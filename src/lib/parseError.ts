import { ZodError } from 'zod'

export const formatZodErrors = (error: ZodError): Record<string, string> => {
  return Object.fromEntries(
    error.issues.map((issue) => [issue.path.join('.'), issue.message])
  )
}
