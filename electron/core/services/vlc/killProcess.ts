export function killProcess(pid: number) {
  process.kill(pid, 'SIGINT')
}