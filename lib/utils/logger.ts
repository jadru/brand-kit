type LogData = unknown
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LOG_LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
}

const rawLogLevel = process.env.ASSET_LOG_LEVEL?.toLowerCase()
const activeLogLevel: LogLevel = rawLogLevel === 'debug' ||
  rawLogLevel === 'info' ||
  rawLogLevel === 'warn' ||
  rawLogLevel === 'error'
  ? rawLogLevel
  : 'info'

interface Logger {
  debug: (message: string, data?: LogData) => void
  info: (message: string, data?: LogData) => void
  warn: (message: string, data?: LogData) => void
  error: (message: string, data?: LogData) => void
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_ORDER[level] >= LOG_LEVEL_ORDER[activeLogLevel]
}

function writeLog(level: LogLevel, message: string, data?: LogData) {
  if (!shouldLog(level)) {
    return
  }

  const payload = {
    ts: new Date().toISOString(),
    level,
    msg: message,
    ...(data !== undefined ? { data } : {}),
  }

  const serialized = JSON.stringify(payload)
  if (level === 'error') {
    console.error(serialized)
    return
  }

  if (level === 'warn') {
    console.warn(serialized)
    return
  }

  process.stdout.write(`${serialized}\n`)
}

export const logger: Logger = {
  debug: (message: string, data?: LogData) => {
    writeLog('debug', message, data)
  },

  info: (message: string, data?: LogData) => {
    writeLog('info', message, data)
  },

  warn: (message: string, data?: LogData) => {
    writeLog('warn', message, data)
  },

  error: (message: string, data?: LogData) => {
    writeLog('error', message, data)
  },
}
