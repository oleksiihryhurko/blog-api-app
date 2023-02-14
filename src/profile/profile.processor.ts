import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ProfileModel, ProfileDocument } from './schemas/profile.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from 'src/user/schemas/user.schema';
import { QueueEvents, QueueNames } from 'src/common/enum/queue.enum';

@Processor(QueueNames.Users)
export class ProfileProcessor {
  constructor(
    @InjectModel(ProfileModel.name)
    protected profileModel: Model<ProfileDocument>,
  ) {}

  @Process(QueueEvents.UserUpdated)
  async update(job: Job) {
    const userUpdates: Pick<UserModel, 'username' | 'bio' | 'image'> = job.data;

    await this.profileModel.findOneAndUpdate(
      { username: userUpdates.username },
      userUpdates,
      { overwrite: false, upsert: true },
    );
    await job.finished();
  }
}
