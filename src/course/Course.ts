import { Module } from "./Module";
import { DomainException } from "../shared/DomainException";

export interface CourseProps {
   id: string;
   title: string;
   description: string;
   metadata?: Record<string, any>;
   modules?: Module[];
}

export class Course {
   private readonly _id: string;
   private _title: string;
   private _description: string;
   private _metadata: Record<string, any>;
   private _modules: Module[];

   constructor(props: CourseProps) {
      if (!props.id) throw new DomainException("Course ID is required");
      if (!props.title || !props.title.trim()) {
         throw new DomainException("Course title is required");
      }

      this._id = props.id;
      this._title = props.title;
      this._description = props.description;
      this._metadata = props.metadata || {};
      this._modules = props.modules || [];
   }

   get id(): string { return this._id; }
   get title(): string { return this._title; }
   get description(): string { return this._description; }
   get metadata(): Record<string, any> { return this._metadata; }
   get modules(): Module[] { 
      return [...this._modules]; 
   }

   public updateDetails(title: string, description: string): void {
      if (!title.trim()) throw new DomainException("Title is required");
      this._title = title;
      this._description = description;
   }

   public addModule(module: Module): void {
      const exists = this._modules.some(m => m.id === module.id);
      if (exists) {
         throw new DomainException(`Module with ID ${module.id} already exists`);
      }
      this._modules.push(module);
      this.sortModules();
   }

   public removeModule(moduleId: string): void {
      this._modules = this._modules.filter(m => m.id !== moduleId);
   }

   private sortModules(): void {
      this._modules.sort((a, b) => a.order - b.order);
   }
}