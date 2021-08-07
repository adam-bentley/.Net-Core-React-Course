import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { List, Image, Popup } from 'semantic-ui-react';
import { Profile } from '../../../app/models/profile';
import ProfileCard from '../../Profiles/ProfileCard';

interface Props
{
    attendees: Profile[];
}

export default observer(function ActivityListItemAttendee({attendees}: Props)
{
    const styles = 
    {
        borderColor: 'orange',
        borderWidth: 3
    }

    return (
        
        <List horizontal>
            {attendees.map(attendee => (
                <Popup hoverable key={attendee.username} trigger={
                    <List.Item  as={Link} to={`/profiles/${attendee.username}`}>
                        <Image style={attendee.following ? styles : null} bordered size='mini' circular src={attendee.image || '/assets/user.png'} />
                    </List.Item>
                }>
                    <Popup.Content>
                        <ProfileCard profile={attendee}/>
                    </Popup.Content>
                </Popup>
            ))}
        </List>
    )
})