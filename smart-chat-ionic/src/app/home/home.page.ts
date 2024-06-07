import { Component, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from '../models/message.model';
import { OpenaiService } from '../services/openai.service';
import { finalize } from 'rxjs';
import { IonContent } from '@ionic/angular';
import { CustomValidators } from '../validators/custom-validators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild(IonContent, {static: false}) content!: IonContent

  openAI = inject(OpenaiService)
  form = new FormGroup({
    prompt: new FormControl('', [Validators.required, CustomValidators.noWhiteSpace]),
  })
  messages: Message[] = []
  loading = false

  submit() {
    if (this.form.valid){
      let prompt = this.form.value.prompt as string
  
      // Prompt del usuario
      let userMsg: Message = { sender: 'me', content: prompt }
      this.messages.push(userMsg)
  
      // Mensaje del bot
      let botMsg: Message = { sender: 'bot', content: '' }
      this.messages.push(botMsg)
      console.log(this.messages);
  
      this.form.reset()
      this.form.disable()
      this.loading = true
      
      // LLAMADO AL BACKEND CON EL PROMPT
      this.openAI.sendQuestion(prompt).pipe(
        finalize(() => {
          this.loading = false
          this.form.enable()
        })
      ).subscribe({
        next: (res: any) => {
          this.typeText(res.bot)
        }, error: (err) => {
          console.log(err);
        },
      })
    }
  }

  typeText(text: string) {
    let textIndex = 0
    let messagesLastIndex = this.messages.length - 1

    let interval = setInterval(() => {
      if(textIndex < text.length) {
        this.messages[messagesLastIndex].content += text.charAt(textIndex)
        textIndex++
        this.scrollToBottom()
      } else (
        clearInterval(interval)
      )
    },1)
  }

  scrollToBottom(){
    this.content.scrollToBottom()
  }
}