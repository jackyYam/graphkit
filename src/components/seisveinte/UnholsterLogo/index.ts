import { UnholsterLogo as Main } from './UnholsterLogo'

const UnholsterLogo = Main as typeof Main & {
  Example1: typeof Main
}
UnholsterLogo.Example1 = Main

export { UnholsterLogo }
