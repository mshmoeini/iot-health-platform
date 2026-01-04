import { Button } from '../../../app/components/ui/button';
import { Input } from '../../../app/components/ui/input';

export function SystemTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-gray-900">System Configuration</h3>

      <div>
        <label className="text-sm">MQTT Broker URL</label>
        <Input defaultValue="mqtt://broker.hivemq.com:1883" />
      </div>

      <div>
        <label className="text-sm">REST API Base URL</label>
        <Input defaultValue="https://api.healthmonitor.com/v1" />
      </div>

      <Button>Save System Config</Button>
    </div>
  );
}
