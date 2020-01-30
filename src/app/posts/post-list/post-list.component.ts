import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})

export class PostListComponent implements OnInit {
  //posts = [
  //  {title: 'First Post', content: 'This is the first post'},
  //  {title: 'Second Post', content: 'This is the second post'},
  //  {title: 'Third Post', content: 'This is the third post'},
  //];
  posts: Post[] = [];
  private postsSub: Subscription;
  private editing = false;
  private editedPost: Post;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  onDelete(postID: string) {
    this.postsService.deletePost(postID);
  }

  //This method will place the correct properties into the edit div and initialize editedPost
  beginEdit(postID: string) {
    this.editing = true;
    this.posts.forEach(element => {
        if(postID == element.id) {
          this.editedPost = element;
        }
    });
    console.log("Started editing the post");
  }

  onEditPost(form: NgForm, id: string) {
    this.postsService.editPost(id, form.value.title, form.value.content);
    form.resetForm();
    this.editing = false;
    this.editedPost = null;
  }

  cancelEdit(form: NgForm) {
    form.resetForm();
    this.editing = false;
    this.editedPost = null;
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
