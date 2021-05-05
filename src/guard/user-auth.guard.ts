import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '../services/config.services';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class UserAuthGuard implements CanActivate {
  private client: ClientProxy;
  constructor(
    private configService: ConfigService,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: this.configService.get('user_ms_host'),
        port: this.configService.get('user_ms_port'),
      }
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: any = context.switchToHttp().getRequest();
      const bearerToken: any = request.headers.authorization.split(' ')[1];
      if (bearerToken) {
        const tokenInfo = await this.client.send('access-token-find-one', { id: bearerToken }).toPromise();
        if (tokenInfo && tokenInfo.token.user) {
          request.user = tokenInfo.user
          if (request.user || tokenInfo.token.isAdmin) {
            return true;
          }
        }
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
    throw new UnauthorizedException();
  }
}
