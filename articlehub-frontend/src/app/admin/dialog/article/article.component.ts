import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ArticleService } from 'src/app/services/article.service';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ThemeService } from 'src/app/services/theme.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit{
  onAddArticle = new EventEmitter();
  onEditArticle = new EventEmitter();
  articleForm:any = FormGroup;
  DialogAction:any = "Add";
  action:any = "Add";
  categorys:any;
  responseMessage:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,private formBuilder:FormBuilder,private categoryService:CategoryService,public dialogRef:MatDialogRef<ArticleComponent>,private snackbarService:SnackbarService,public themeService:ThemeService,private articleService:ArticleService,private ngxService:NgxUiLoaderService){}

  ngOnInit(): void {
    this.articleForm = this.formBuilder.group({
      title:[null,[Validators.required]],
      content:[null,[Validators.required]],
      categoryId:[null,[Validators.required]],
      status:[null,[Validators.required]]

    });
    if(this.dialogData.action === 'Edit'){
      this.DialogAction = "Edit";
      this.action = "Update";
      this.articleForm.patchValue(this.dialogData.data);
    }
    this.getAllCategory();
    this.ngxService.start();

      
  }
  getAllCategory(){
    this.categoryService.getAllCtaegory().subscribe((response:any)=>{
      this.categorys = response;
      this.ngxService.stop();

    },(error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;

      }
      this.snackbarService.openSnackBar(this.responseMessage);

    })



  }
  handleSubmit(){
    if(this.DialogAction === "Edit"){
      this.edit()
      
    }
    else{
      this.add();

    }
  }
  add(){
    this.ngxService.start();
    var formData = this.articleForm.value;
    var data={
      title:formData.title,
      content:formData.content,
      categoryID: formData.categoryId,
      status:formData.status
    }
    this.articleService.addNewArticle(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.ngxService.stop();
      this.onAddArticle.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage);
    },(error:any)=>{
      this.dialogRef.close();
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage);
    })
  }

  edit(){
    this.ngxService.start();
    var formData = this.articleForm.value;
    var data={
      id:this.dialogData.data.id,
      title:formData.title,
      content:formData.content,
      categoryID: formData.categoryId,
      status:formData.status
    }
    this.articleService.updateArticle(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.ngxService.stop();
      this.onEditArticle.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage);
    },(error:any)=>{
      this.dialogRef.close();
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage);
    })
  }

}

