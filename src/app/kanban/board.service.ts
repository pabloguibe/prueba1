import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { switchMap, map } from 'rxjs/operators';
import { Board, Task } from './board.model';
@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  async createBoard(data: Board) {
    const user = await this.afAuth.currentUser;
    return this.db.collection('boards').add({
      ...data,
      uid: user?.uid,
      tasks: [{ description: 'hello!', label: 'yellow' }]
    });


  }

  deleteBoard(boardId: string) {
    return this.db
      .collection('boards')
      .doc(boardId)
      .delete();
  }

  updateTasks(boardId: string, tasks: Task[]) {
    return this.db
      .collection('boards')
      .doc(boardId)
      .update({ tasks });
  }


  removeTask(boardId: string, task: Task) {
    return this.db
      .collection('boards')
      .doc(boardId)
      .update({
        tasks: firebase.firestore.FieldValue.arrayRemove(task)
      });
  }


  getUserBoards() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if(user){
          return this.db
          .collection<Board>('boards', ref =>
          ref.where('uid', '==', user.uid).orderBy('priority')
          )
          .valueChanges({idField:'id'});
        }else{
          return[];
        }
      })
    )
  }
}
