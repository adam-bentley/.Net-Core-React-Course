import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent';
import { Activity } from '../models/activity'
import {v4 as uuid} from 'uuid';

export default class ActivityStore
{
    activities: Activity[] = [];
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;

    constructor()
    {
        makeAutoObservable(this)
    }

    get activitiesByDate()
    {
        return this.activities.slice().sort((a, b) => 
            Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async () => 
    {       
        try 
        {
            const activities = await agent.Activities.list();

            runInAction(() => 
            {
                activities.forEach(activity =>
                {
                    activity.date = activity.date.split('T')[0];
                    this.activities.push(activity);
                })
                this.loadingInitial = false;
            })
        }
        catch (error)
        {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    setLoadingInitial = (state: boolean) =>
    {
        this.loadingInitial = state;
    }

    selectActivity = (id: string) => 
    {
        this.selectedActivity = this.activities.find(a => a.id === id);
    }

    cancelSelectedActivity = () =>
    {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => 
    {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm = () =>
    {
        this.editMode = false;
    }

    createActivity = async (activity: Activity) => 
    {
        this.loading = true;
        activity.id = uuid();

        try
        {
            await agent.Activities.create(activity);
            runInAction(() => 
            {
                this.activities.push(activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        }
        catch (error)
        {
            console.log(error);
            runInAction(() => 
            {
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => 
    {
        this.loading = true;

        try
        {
            await agent.Activities.update(activity);
            runInAction(() => 
            {
                this.activities = [...this.activities.filter(a => a.id !== activity.id), activity];
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        }
        catch (error)
        {
            console.log(error);
            runInAction(() => 
            {
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) =>
    {
        this.loading = true;

        try 
        {
            await agent.Activities.delete(id);
            runInAction(() => 
            {
                this.activities = [...this.activities.filter(x => x.id !== id)];

                if (this.selectedActivity?.id === id) this.cancelSelectedActivity();

                this.loading = false;
            })
        } 
        catch (error) 
        {
            console.log(error);
            runInAction(() => 
            {
                this.loading = false;
            })
        }
    }
}