import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

export default function Home() {
  return (
    <div className="p-8 space-y-4">
      <div className="flex gap-4">
        <Button variant="default" size="small" leftIcon={null}>Button</Button>
        <Button variant="default" size="medium" leftIcon={null}>Button</Button>
      </div>
      <div className="flex gap-4">
        <Button variant="outlined" size="small" rightIcon={null}>Button</Button>
        <Button variant="outlined" size="medium" leftIcon={null} rightIcon={null}>Button</Button>
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
        <Button variant="tertiary" size="small" rightIcon={null}>Button</Button>
        <Button variant="tertiary" size="medium" rightIcon={null}>Button</Button>
      </div>
      
      <div className="space-y-4">
        <Input size="medium" status="default" placeholder="Medium Input" />
        <Input size="small" status="default" placeholder="Samll Input" />
        <Input size="medium" status="disabled" placeholder="Disabled Input" />
        <Input size="small" status="disabled" placeholder="Disabled Input" />
        <Input size="medium" status="error" placeholder="Error Input" />
        <Input size="small" status="error" placeholder="Error Input" />
      </div>
    </div>
  );
}