import { observer } from 'mobx-react-lite'
import React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import LoadingComponent from '../../app/layout/LoadingComponent'
import { Profile } from '../../app/models/profile'
import { useStore } from '../../app/stores/store'
import ProfileContent from './ProfileContent'
import ProfileHeader from './ProfileHeader'

interface Props
{
    Profile: Profile;
}

export default observer(function ProfilePage() 
{
    const { username } = useParams<{username: string}>();
    const { profileStore } = useStore();
    const { loadingProfile, loadProfile, profile } = profileStore;

    useEffect(() => 
    {
        loadProfile(username)
    }, [username, loadProfile])

    if (loadingProfile) return <LoadingComponent content='Loading profile' />

    return (
        <Grid>
            <Grid.Column width={16}>
                { profile && 
                    <ProfileHeader profile={profile} />                }
                { profile && 
                    <ProfileContent profile={profile} />
                }
            </Grid.Column>
        </Grid>
    )
})