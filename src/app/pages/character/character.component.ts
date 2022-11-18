import {Component, OnDestroy, OnInit} from '@angular/core';
import {CharacterService} from "../../services/character.services";
import {Character} from "../../models/character.model";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit, OnDestroy {

  characters: Character[] = [];
  total = 0;
  currentPage = 1;
  ngDestroyed$ = new Subject<void>();
  loading$ = new BehaviorSubject<boolean>(false)
  constructor(private characterService: CharacterService) { }

  ngOnInit(): void {
    this.getCharacters(this.currentPage);
  }
  ngOnDestroy() {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete()
  }

  getCharacters(page: number): void {
    this.loading$.next(true);
    this.currentPage = page
    this.characterService
      .getCharacters(page)
      .pipe(
      takeUntil(this.ngDestroyed$)
    ).subscribe((response) => {
      console.log(response)
      this.characters = response.results
      this.total = response.info.pages;
      this.loading$.next(false)
    })
  }

}
