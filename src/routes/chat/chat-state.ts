interface ChatState {
	connect: () => boolean
	disconnect: () => boolean
}

export class Chat implements ChatState {
	constructor() {

	}
}
