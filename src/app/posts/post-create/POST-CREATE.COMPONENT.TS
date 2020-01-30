import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';


import { PostsService } from '../posts.service';


@Component({
  selector: 'app-post-create',
  templateUrl: './POST-CREATE.COMPONENT.HTML',
  styleUrls: ['./post-create.component.css']
})

 export class PostCreateComponent {
   enteredTitle = '';
   enteredContent = '';


   constructor(public postsService: PostsService) {}

   onAddPost(form: NgForm) {
     if(form.invalid) {
       return;
     }
     this.postsService.addPost(form.value.title, form.value.content);
     form.resetForm();
   }
}
