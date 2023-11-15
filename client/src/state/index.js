import {proxy} from 'valtio';

const state = proxy({
    allChats:[],
    currentChat: null,
    user:null,
    token:null,
})

export default state;