import { UTIL } from '@/utils/data/apiRoutes';
import { $host } from './index';

class UtilService {
  static async ping(): Promise<boolean> {
    const { data } = await $host.post(`${UTIL}/ping`);
    return data;
  }
}

export default UtilService;
