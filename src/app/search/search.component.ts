import { Component } from '@angular/core';
import { PostsService } from '../posts/posts.service';

@Component({
  selector: 'app-search-component',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent {
  private value: string = '';

  constructor(public postsService: PostsService) {}

  onSearch() {
    if(this.value === ''){
      console.log("Cleared the search.");
    } else {
      console.log("Searched for " + this.value);
    }
    this.postsService.search(this.value);
  }

  clearValue() {
    this.value = '';
    this.onSearch();
  }
}
