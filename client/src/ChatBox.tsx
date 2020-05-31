import React, {useState, useEffect} from "react";


interface Msg {
    message?: string
    platform?: string
    text: {
        text: string[]
    }
}

interface Message {
    speak: string
    msg: Msg
}

const ChatBox: React.FC = () => {
    const [ messages, setMessages ] = useState<Message[]>([]);

    const df_text_query = async(text: string) => {
        let says = {
            speak: 'me',
            msg: {
                text: {
                    text: [text]
                }
            }
        };
        setMessages(prevMessages => [ ...prevMessages, says ]);
        const res = await fetch('/api/df_text_query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        const result = await res.json();
        const responseMsgs = result.fulfillmentMessages.map((msg: Message) => ({ speak: 'bot', msg }));
        setMessages(prevMessages => [ ...prevMessages, ...responseMsgs]);
    };

    const df_event_query = async (event: string) => {
        const res = await fetch('/api/df_event_query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ event })
        });
        const result = await res.json();
        const responseMsgs = result.fulfillmentMessages.map((msg: Message) => ({ speak: 'bot', msg }));
        setMessages(prevMessages => [ ...prevMessages, ...responseMsgs]);
    };

    useEffect(() => {
        const res = df_event_query('Welcome');
    }, []);

    const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const newEvent = e;
        if(newEvent.key === 'Enter') {
            const res = df_text_query(newEvent.currentTarget.value);
        }
    };

    return (
        <div>
            <h2>ChatBox</h2>
            <input
                onKeyPress={handleInputKeyPress}
            />
            <div>
                {
                    messages
                    && messages.length > 0
                    && messages.map(({ speak, msg }, index) => {
                        return (
                            <div key={index} style={{ margin: '10px', padding: '10px', border: '1px solid black'}}>
                                {speak}: {msg.text.text}
                            </div>
                        )
                    })

                }
            </div>
        </div>
    );
};

export default ChatBox;