import React, { useState, useEffect, useRef } from "react";

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
    const [ value, setValue ] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
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

    const handleInputKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.persist();
        if(e.key === 'Enter') {
            const res = await df_text_query(value);
            setValue('');
            if (inputRef.current) inputRef.current.scrollIntoView();
        }
    };

    return (
        <div
            style={{ height: '100%', width: '100%', overflow: 'auto' }}
        >
            <h2>ChatBox</h2>
            <div>
                {
                    messages
                    && messages.length > 0
                    && messages.map(({ speak, msg }, index) => {
                        return (
                            <div key={index} style={styles.messageWrapper}>
                                {speak}: {msg.text.text}
                            </div>
                        )
                    })

                }
            </div>
            <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyPress={handleInputKeyPress}
            />
        </div>
    );
};

const styles = {
    messageWrapper: {
        margin: 'auto',
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: 'palegreen',
        width: 'fit-content',
        borderRadius: '1rem'
    }
}

export default ChatBox;