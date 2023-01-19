import {dbCollections} from "../server/db/conn";
import {refreshTokenSecret} from "../services/users-service";


const requestsRepository = {
    async addNewRequest(ip: string, requestTime: Date): Promise<boolean> {
        let result = false
        const ipEntity = await this.isIpNew(ip)
        if (ipEntity) {
            const newItem  = await dbCollections.requestsInfo.insertOne({
                ip,
                requestsTime: [requestTime]
            })
            result = newItem.acknowledged
        } else {
            const updatedItem = await dbCollections.requestsInfo.updateOne({ip}, {$push: {"requestsTime": requestTime}});
            if (updatedItem.modifiedCount === 1) {result = true}
        }
        return result;
    },
    async isIpNew(ip: string,): Promise<boolean> {
        let result = true
        const ipInfo = await dbCollections.requestsInfo.findOne({ip})
        if (ipInfo) {
            result = false
        }
        return result;
    },
    async deleteRequestsByIp(ip:string,): Promise<boolean> {
        const result = await dbCollections.requestsInfo.deleteOne({ip})
        return result.deletedCount === 1
    },
    async findAllRequestsByIp (ip:string,): Promise<Date[]|undefined>{
        const result = await dbCollections.requestsInfo.findOne({
            "ip": ip,
        }, {projection: {_id: 0, ip: 0}})
        return result?.requestsTime
    }

}

export {requestsRepository}


type RequestsInfoType = {
    ip: string,
    requestsTime: Date[]
}
