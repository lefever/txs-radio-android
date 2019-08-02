import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { AudioPlayerService } from './audio-player.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  isPlaying = false;
  playerStatus = 'Detenido';
  currentProg = 'TXS Radio';
  currentTrack = 'Ciencia y tecnología';
  currentId: any = null;
  currentTime: any = null;
  trackDuration: any = null;
  streamType: any = null;
  time: any;
  seeking = false;

  subscription: Subscription;
  removeItem: Subscription;

  public queuedTracks: Array<{url: string, type: string, info: string, id: string, prog: string, thumb: string}> = [];

  constructor(
    private playerService: AudioPlayerService,
    public storage: Storage
  ) { 
    this.subscription = this.playerService.getAction().subscribe(action => {
      this.playerStatus = action.state;
      this.currentId = action.currentId;
    });
    this.populateArray();
  }

  ionViewWillEnter() {
    this.populateArray();
  }

  public add (url, type, info, id, prog, thumb) {
    let newTrack = {
      url: url,
      type: type,
      info: info,
      id: id,
      prog: prog,
      thumb: thumb
    };
    this.queuedTracks.push(newTrack);
    this.storage.set('queuedTracks', this.queuedTracks);
  }

  public remove(id) {
    for(var a = 0; a < this.queuedTracks.length; a++) {
      for(var b in this.queuedTracks[a]) {
        if(this.queuedTracks[a][b] === id) {
            this.queuedTracks.splice(a, 1);
            this.storage.set('queuedTracks', this.queuedTracks);
            a--;
            break;
        }
      }
    }
  }

  getData() {
    return this.storage.get('queuedTracks');
  }

  populateArray() {
    this.getData().then((array) => {
      this.queuedTracks = array;
    });
  }
}
