import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from 'angularfire2/firestore';
import { Todo } from './todo.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TodoListService {
  todoList: AngularFirestoreCollection<Todo>;
  todos: Observable<Todo[]>;
  todoDoc: AngularFirestoreDocument<Todo>;

  constructor(public afs: AngularFirestore) {
    // this.todos = this.fs.collection('todos').valueChanges();
    this.todoList = this.afs.collection('todos');
    this.todos = this.todoList.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((a) => {
          const data = a.payload.doc.data() as Todo;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  getTodos() {
    return this.todos;
  }

  addTodo(todo: Todo) {
    this.todoList.add(todo);
  }

  deleteTodo(todo: Todo) {
    this.todoDoc = this.afs.doc(`todos/${todo.id}`);
    this.todoDoc.delete();
  }
}
