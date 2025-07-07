import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Form } from '@/shared/ui/Form';
import { AudioControl } from '@/shared/ui/AudioControl';
import { Selector } from '@/shared/ui/Selector';

export default function Home() {
 const selectorOptions = [
   { id: '1', label: '선택지 1' },
   { id: '2', label: '선택지 1' },
   { id: '3', label: '선택지 1' },
 ];

 return (
   <div className="p-8 space-y-8 max-w-fit">
     <div className="flex gap-8">
       <div className="border-2 border-dashed border-purple-500 p-6 rounded-lg w-fit">
         <div className="space-y-4">
           <div className="flex gap-4">
             <Button variant="default" size="small">Button</Button>
             <Button variant="default" size="medium">Button</Button>
           </div>
           <div className="flex gap-4">
             <Button variant="outlined" size="small">Button</Button>
             <Button variant="outlined" size="medium">Button</Button>
           </div>
           <div className="flex gap-4">
             <Button variant="primary" size="small">Button</Button>
             <Button variant="primary" size="medium">Button</Button>
           </div>
           <div className="flex gap-4">
             <Button variant="negative" size="small">Button</Button>
             <Button variant="negative" size="medium">Button</Button>
           </div>
           <div className="flex gap-4">
             <Button variant="secondary" size="small">Button</Button>
             <Button variant="secondary" size="medium">Button</Button>
           </div>
           <div className="flex gap-4">
             <Button variant="tertiary" size="small" leftIcon={null}>Button</Button>
             <Button variant="tertiary" size="medium" rightIcon={null}>Button</Button>
           </div>
         </div>
       </div>

       <div className="border-2 border-dashed border-purple-500 p-6 rounded-lg w-fit">
         <div className="space-y-4">
           <Input size="medium" status="default" placeholder="Medium Input" />
           <Input size="small" status="default" placeholder="Small Input" />
           <Input size="medium" status="disabled" placeholder="Disabled Input" />
           <Input size="small" status="disabled" placeholder="Disabled Input" />
           <Input size="medium" status="error" placeholder="Error Input" />
           <Input size="small" status="error" placeholder="Error Input" />
         </div>
       </div>

       <div className="border-2 border-dashed border-purple-500 p-6 rounded-lg w-fit">
         <Selector options={selectorOptions} selectedId="2" />
       </div>
     </div>

     <div className="flex gap-8">
       <div className="border-2 border-dashed border-purple-500 p-6 rounded-lg w-fit">
         <div className="space-y-4">
           <Form label="Label" required placeholder="Enter your ID" />
           <Form
             label="Label"
             required
             placeholder="Enter your ID"
             inputStatus="error"
             errorMessage="ID field is required"
           />
           <Form label="Label" placeholder="Enter your ID" inputStatus="disabled" />
         </div>
       </div>

       <div className="border-2 border-dashed border-purple-500 p-6 rounded-lg w-fit">
         <div className="space-y-4">
           <AudioControl variant="default" playing={true} />
         </div>
         <div className="mt-10">
            <AudioControl variant="core" playing={false} />
         </div>
       </div>
     </div>
   </div>
 );
}