import { HTTPTCommunityGateway } from "@/infrastructure/HTTPCommunityGateway"
import { HTTPTThreadGateway } from "@/infrastructure/HTTPThreadGateway"
import { HTTPUserGateway } from "@/infrastructure/HTTPUserGateway"
import { CommunityService } from "./CommunityService"
import { ThreadService } from "./ThreadService"
import { UserService } from "./UserService"

// USER SERVICE
const httpUserGateway = new HTTPUserGateway()
const userService = new UserService(httpUserGateway)

// COMMUNITY SERVICE
const httpCommunityGateway = new HTTPTCommunityGateway()
const communityService = new CommunityService(httpCommunityGateway)

// THREAD SERVICE
const httpThreadGateway = new HTTPTThreadGateway()
const threadService = new ThreadService(httpThreadGateway)

export { communityService, threadService, userService }
