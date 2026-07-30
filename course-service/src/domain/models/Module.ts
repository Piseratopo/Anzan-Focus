export interface ModuleProps {
   id: string;
   title: string;
   description: string;
   order: number;
}

export class Module {
   private readonly _id: string;
   private _title: string;
   private _description: string;
   private _order: number;

   constructor(props: ModuleProps) {
      if (!props.id) throw new Error("Module ID is required");
      if (!props.title) throw new Error("Module title is required");
      
      this._id = props.id;
      this._title = props.title;
      this._description = props.description;
      this._order = props.order;
   }

   get id(): string { return this._id; }
   get title(): string { return this._title; }
   get description(): string { return this._description; }
   get order(): number { return this._order; }

   public updateDetails(title: string, description: string): void {
      if (!title.trim()) {
         throw new Error("Module title cannot be empty");
      }
      this._title = title;
      this._description = description;
   }
}