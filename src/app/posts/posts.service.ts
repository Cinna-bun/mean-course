import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  editPost(postId: string, title: string, content: string) {
    if(title.trim() === '' && content.trim() === '') {
      return;
    }
    const post: Post = {id: postId, title: title, content: content};
    this.http.post<{message: string}>('http://localhost:3000/api/posts/' + postId, post)
      .subscribe((responseData) => {
        const index = this.posts.findIndex(element => element.id === postId);
        if(title.trim() === '') {
          this.posts[index].content = content;
        } else if(content.trim() === '') {
          this.posts[index].title = title;
        } else {
          this.posts[index].title = title;
          this.posts[index].content = content;
        }
        this.postsUpdated.next([...this.posts]);
      });

    console.log("We made it to editPost!");
  }

  /*This method will search the current array of posts in order to find
  posts which contain a body with the searched content, or a title with
  the searched content using regular expressions*/
  search(query: string) {
    if(query === '' || query == null) {
      this.postsUpdated.next([...this.posts]);
    }
    const regex = new RegExp(query, 'i');
    const filteredPosts = this.posts.filter(post => post.title.match(regex) || post.content.match(regex));
    this.postsUpdated.next([...filteredPosts]);
  }
}
