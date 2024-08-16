import Event from '../../../structures/Event.js';

export default class ReadyEvent extends Event {
    trigger = 'ready';

    exec() {
        console.log('[general] Бот запущен!');
    }
}
