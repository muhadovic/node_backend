import { Injectable, HttpStatus, HttpException, forwardRef, Inject } from '@nestjs/common';
import { IUser } from '../../../interfaces/user.interface';
import { UploadFileDto } from '../../../services/file-storage/dto/upload-file.dto';
import { FileStorageService } from '../../../services/file-storage/file-storage.service';
import * as path from 'path';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '../../../services/config.services';
import { AdvertisementService } from '../../advertisement/services/advertisement.service';
import { ChatService } from '../../../modules/chat/services/chat.service';
import { FriendsRequestService } from '../../friends-request/services/friends-request.service';
import { NotificationDto } from '../dto/notification.dto';
import { UserRoleEnum } from '../../../enums/user-role.enum';
import { FriendStatusEnum } from '../../../enums/friend-status.dto';
import { FriendsRequestTypeEnum } from '../../../enums/friends-request-types.enum';
import { CompleteUserEnum } from '../../../enums/complete-user.enum';
import { CardService } from './card.service';
import { ICard } from '../../../interfaces/card.interface';
import { UserStatusEnum } from '../../../enums/user-status.enum';
import { PushNotificationsService } from '../../../services/push-notification/push-notification.service';
const milesToMeters = 1609.344

@Injectable()
export class UserService {
  private client: ClientProxy;
  constructor(
    private readonly fileStorageService: FileStorageService,
    private readonly configService: ConfigService,
    private readonly chatService: ChatService,
    private readonly advertisementService: AdvertisementService,
    private readonly friendsRequestService: FriendsRequestService,
    private readonly cardService: CardService,
    private readonly pushNotificationsService: PushNotificationsService,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: this.configService.get('user_ms_host'),
        port: this.configService.get('user_ms_port'),
      }
    });
  }

  public async getById(userId: any): Promise<any> {
    const user = await this.client.send('user-find-one', { _id: userId }).toPromise();
    user.advertisements = await this.advertisementService.getAll({ _id: { $in: user.advertisements } });
    const cards = await this.cardService.find({ user: userId });
    user.cards = cards.map((card: ICard) => {
      return card.card
    });
    return user
  }

  public async getUserById(userId: any, findUserId: string): Promise<any> {
    const user = await this.client.send('user-find-one', { _id: findUserId }).toPromise();
    const isFriend = await this.checkIsFriend(userId, user._id)
    return { ...user, ...isFriend };
  }

  public async getOnlyUser(userId: IUser['_id']): Promise<IUser> {
    return await this.client.send('user-find-one', { _id: userId }).toPromise();
  }

  public async getLoveCoin(userId: IUser['_id']): Promise<any> {
    const user: IUser = await this.client.send('user-find-one', { _id: userId }).toPromise();
    return { loveCoin: user.loveCoin };
  }

  public async findFriends(userId: IUser['_id']): Promise<any> {
    const friendRelations = await this.client.send('friend-relation-find', { owner: userId }).toPromise();
    const response = await Promise.all(friendRelations.map(async (friendRelation) => {
      const user = await this.client.send('user-find-one', { _id: friendRelation.friend }).toPromise();
      return {
        ...friendRelation,
        mediaFileCount: await this.chatService.getMediaFileCount(userId, user._id),
        image: user.image,
        phoneNumber: user.phoneNumber,
        lastActivity: user.lastActivity,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    }))
    return response
  }

  public async findFriendRelations(userId: IUser['_id']): Promise<any> {
    const friendRelations = await this.client.send('friend-relation-find', { owner: userId }).toPromise();
    return friendRelations;
  }

  public async notification(data: NotificationDto): Promise<any> {
    const friendRelation = await this.client.send('friend-relation-update', data).toPromise();
    const user = await this.client.send('user-find-one', { _id: friendRelation.friend }).toPromise();
    return {
      ...friendRelation,
      mediaFileCount: await this.chatService.getMediaFileCount(friendRelation.owner, user._id),
      image: user.image,
      phoneNumber: user.phoneNumber,
      lastActivity: user.lastActivity,
      firstName: user.firstName,
      lastName: user.lastName,
    }
  }

  public async update(user: IUser): Promise<IUser> {
    const userData = await this.client.send('user-find-and-update', { conditions: { _id: user._id }, dataToUpdate: user }).toPromise();
    userData.advertisements = await this.advertisementService.getAll({ _id: { $in: userData.advertisements } });
    return userData;
  }

  public async updateRole(userId: string, role: number): Promise<IUser> {
    return await this.client.send('user-find-and-update', { conditions: { _id: userId }, dataToUpdate: { $push: { role: role } } }).toPromise();
  }

  public async updateBalance(query: any, data: any): Promise<IUser> {
    return await this.client.send('user-find-and-update', { conditions: query, dataToUpdate: data }).toPromise();
  }


  public async delete(query: any): Promise<any> {
    if (!Object.keys(query).length) {
      throw new Error(`Empty query in findOne`);
    }
    await this.client.send('user-delete', query).toPromise();
    return {
      message: 'success'
    }
  }

  public async updateUser(userId: string, data: IUser, newFile: UploadFileDto): Promise<any> {
    let dataToUpdate: any = {}
    const user = await this.client.send('user-find-one', { _id: userId }).toPromise();
    if (data.nickName && user.nickName !== data.nickName) {
      const userNickName = await this.client.send('user-find-one', { nickName: data.nickName }).toPromise();
      if (userNickName) {
        throw {
          message: 'The nick name is already exist',
          status: 400,
        }
      }
    }
    if (data) {
      dataToUpdate = data
    }
    if (newFile) {
      dataToUpdate.image = await this.uploadFile(userId, newFile);
    }
    const userData = await this.client.send('user-find-and-update', { conditions: { _id: userId }, dataToUpdate: dataToUpdate }).toPromise();
    userData.advertisements = await this.advertisementService.getAll({ _id: { $in: userData.advertisements } });
    return userData
  }

  public async uniqueNickName(userId: string, nickName: string): Promise<any> {
    const userNickName = await this.client.send('user-find-one', { nickName: nickName, _id: { $ne: userId } }).toPromise();
    if (userNickName) {
      throw {
        message: 'The nick name is already exist',
        status: 400,
      }
    } else {
      return {
        message: 'success'
      }
    }
  }

  public async uploadFile(userId, newFile: UploadFileDto): Promise<any> {
    try {
      const user = await this.getById(userId);
      const fileName: string = String(new Date().getTime());
      const extension: string = path.extname(newFile.originalname);
      const filePath: string = `uploads/user/${userId}/${fileName}${extension}`;
      const data: {
        uploadedfile: any;
        responseData: any;
      } = await this.fileStorageService.uploadFileToAws(filePath, newFile);
      return data.responseData.Location;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  public async getUserByRadius(userId, data): Promise<any> {
    try {
      const user = await this.client.send('user-find-one', { _id: userId }).toPromise();
      let coordinates;
      if (data.coordinates) {
        coordinates = data.coordinates;
      } else {
        coordinates = user.location.coordinates;
      }
      const query = {
        location: {
          $near: {
            $maxDistance: data.radius * milesToMeters,
            $geometry: {
              type: "Point",
              coordinates: coordinates
            }
          }
        },
        _id: { $ne: userId },
        completeUser: CompleteUserEnum.complete
      }
      const users = await this.client.send('user-find', query).toPromise();
      const response = await Promise.all(users.map(async (user: any) => {
        const isFriend = await this.checkIsFriend(userId, user._id)
        return { ...user, ...isFriend };
      }))
      return response
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  public async getUsers(userId, data): Promise<any> {
    try {
      let query: any = {
        _id: { $ne: userId },
        completeUser: CompleteUserEnum.complete
      };
      if (data.nickName) {
        query.nickName = data.nickName
      }
      if (data.email) {
        query.email = data.email
      }
      if (data.phoneNumber) {
        query.phoneNumber = data.phoneNumber
      }
      if (data.name) {
        let searchArray = []
        if (data.name.indexOf(" ") == -1) {
          searchArray.push({ firstName: { $regex: data.name, $options: 'i' } })
          searchArray.push({ lastName: { $regex: data.name, $options: 'i' } })
        } else {
          const firstWorld = data.name.slice(0, data.name.indexOf(" "))
          const SecondWorld = data.name.slice(data.name.indexOf(" ") + 1)
          searchArray.push({
            $and: [
              { firstName: { $regex: firstWorld, $options: 'i' } },
              { lastName: { $regex: SecondWorld, $options: 'i' } }
            ]
          })
          searchArray.push({
            $and: [
              { firstName: { $regex: SecondWorld, $options: 'i' } },
              { lastName: { $regex: firstWorld, $options: 'i' } }
            ]
          })
        }
        query = {
          $or: searchArray,
          _id: { $ne: userId },
          completeUser: CompleteUserEnum.complete
        }
      }
      const users = await this.client.send('user-find-page', { query: query, page: data.page }).toPromise();
      const response = await Promise.all(users.map(async (user: any) => {
        const isFriend = await this.checkIsFriend(userId, user._id)
        return { ...user, ...isFriend };
      }))
      return response
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  public async addFriends(userId, friendId, notification): Promise<any> {
    try {
      await this.client.send('friend-relation-create', { owner: userId, friend: friendId, notification: notification }).toPromise();
      await this.client.send('friend-relation-create', { owner: friendId, friend: userId, notification: true }).toPromise();
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  public async checkIsFriend(userId, friendId): Promise<any> {
    const friendRelations = await this.findFriendRelations(userId);
    const myFriendRequest = await this.friendsRequestService.getOne({ owner: userId, recipient: friendId })
    const friendRequest = await this.friendsRequestService.getOne({ owner: friendId, recipient: userId })
    let isFriend: any = {
      isFriend: FriendStatusEnum.notFriend
    };
    const friendsIds = await Promise.all(friendRelations.map(async (friendRelation: any) => {
      return friendRelation.friend;
    }))
    if (friendsIds.indexOf(friendId) != -1) {
      isFriend = {
        isFriend: FriendStatusEnum.friend
      };
    } else if (myFriendRequest && myFriendRequest.type == FriendsRequestTypeEnum.friendRequest) {
      isFriend = {
        isFriend: FriendStatusEnum.friendRequest,
        friendsRequestId: myFriendRequest._id
      };
    } else if (friendRequest && friendRequest.type == FriendsRequestTypeEnum.friendRequest) {
      isFriend = {
        isFriend: FriendStatusEnum.userFriendRequest,
        friendsRequestId: friendRequest._id
      };
    }
    return isFriend;
  }

  public async deleteFriend(userId: string, id: string): Promise<any> {
    try {
      const friendRelation = await this.client.send('friend-relation-find-one', { $or: [{ owner: userId, friend: id }, { owner: id, friend: userId }] }).toPromise();
      await this.client.send('friend-relation-delete', { owner: friendRelation.friend, friend: friendRelation.owner }).toPromise();
      await this.client.send('friend-relation-delete', { owner: friendRelation.owner, friend: friendRelation.friend }).toPromise();
      await this.chatService.deleteChat(friendRelation.owner, friendRelation.friend);
      return {
        message: 'success'
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  public async createWalletPassword(userId: string, password: string): Promise<any> {
    const user: any = await this.client.send('user-create-wallet-password', { _id: userId, password: password }).toPromise();
    user.advertisements = await this.advertisementService.getAll({ _id: { $in: user.advertisements } });
    return user
  }

  public async updateWalletPassword(userId: string, oldPassword: string, newPassword: string): Promise<any> {
    const user: any = await this.client.send('user-change-wallet-password', { _id: userId, oldPassword: oldPassword, newPassword: newPassword }).toPromise();
    if (user.message) {
      throw user
    }
    return user
  }

  public async checkWalletPassword(userId: string, password: string): Promise<any> {
    const user: any = await this.client.send('user-check-wallet-password', { _id: userId, password: password }).toPromise();
    if (user.message) {
      throw user
    }
    user.advertisements = await this.advertisementService.getAll({ _id: { $in: user.advertisements } });
    return user
  }

  public async addCard(userId: string, card: any): Promise<any> {
    await this.cardService.create(userId, card)
    return await this.getById(userId)
  }

  public async getUserByAdmin(userId: string, page: number): Promise<any> {
    const users = await this.client.send('user-find-page', { query: {}, page: page }).toPromise();
    const allUsers = await this.client.send('user-find', {}).toPromise();
    return {
      users: users,
      totalNumber: allUsers.length
    }
  }

  public async suspendAccount(userId: string): Promise<any> {
    await this.client.send('user-find-and-update', { conditions: { _id: userId }, dataToUpdate: { status: UserStatusEnum.inactive } }).toPromise();
    return {
      message: 'success'
    }
  }
}
