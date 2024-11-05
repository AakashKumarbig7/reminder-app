'use client'
import React from 'react';
import { MentionsInput, Mention } from 'react-mentions'
import classNames from '@/styles/example.module.css'
import { Textarea } from "@/components/ui/textarea"

export function MentionInput() {

    function fetchUsers(query: any, callback: any) {
        if (!query) return
        fetch(`https://api.github.com/search/users?q=${query}`)
            .then(res => res.json())

            // Transform the users to what react-mentions expects
            .then(res =>
                res.items.map((user: any) => ({ display: user.login, id: user.login }))
            )
            .then(callback)
    }

    const [value, setValue] = React.useState('');
    const onChange = ({ target }: { target: any }) => {
        setValue(target.value);
    };

    return (
        <MentionsInput
            name='description'
            value={value}
            onChange={onChange}
            a11ySuggestionsListLabel={"Suggested mentions"}
            classNames={classNames}
            className="mentions"
            placeholder='Enter your comments...'
        >
            <Mention
                trigger="@"
                displayTransform={(display) => `@${display}`}
                data={fetchUsers}
                className={classNames.mentions__mention}
            />
        </MentionsInput>
    )
}