import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Auth, signOut } from '@angular/fire/auth'

declare let Kakao: any

import { User } from '@schemas/user'
import { Center } from '@schemas/center'

// import { WsChatService } from '@services/web-socket/ws-chat.service'

import _ from 'lodash'
import { CenterUser } from '@schemas/center-user'
import { Subject } from 'rxjs'

type UserOrEmpty = User | { sign_in_method: string }

@Injectable({ providedIn: 'root' })
export class StorageService {
    private storage = localStorage // sessionStorage
    private userKey = 'redwhale:authUser'

    public readonly userChangeSubject = new Subject()

    constructor(private fireAuth: Auth, private router: Router) {}

    getUser(): User {
        const user = JSON.parse(this.storage.getItem(this.userKey) as string) as User
        return !_.isEmpty(user) ? user : ({} as User)
    }
    setUser(user: UserOrEmpty): void {
        this.storage.setItem(this.userKey, JSON.stringify(user))
    }
    isUserEmpty(): boolean {
        const user = JSON.parse(this.storage.getItem(this.userKey) as string)
        return (
            // 한번 info화면에서 이메일 정보를 입력한 뒤의 경우와 단순히 빈 유저 데이터일 경우
            (!_.isEmpty(user) &&
                Object.keys(user).length == 1 &&
                !!Object.keys(user).find((key) => key == 'sign_in_method')) ||
            _.isEmpty(user)
        )
    }
    isSocialUser(): boolean {
        const user = JSON.parse(this.storage.getItem(this.userKey) as string)
        return this.isUserEmpty() ? false : user?.sign_in_method != 'email'
    }

    setAccessToken(token: string) {
        const user = { ...this.getUser(), access_token: token }
        this.setUser(user)
    }

    async removeUser() {
        if (Kakao.Auth && Kakao.Auth.getAccessToken()) {
            const logout = new Promise((resolve, reject) => {
                Kakao.Auth.logout(() => {
                    resolve(null)
                })
            })
            await logout
        }
        await signOut(this.fireAuth)
        this.storage.removeItem(this.userKey)
    }

    async logout() {
        await this.removeUser()
        await this.router.navigateByUrl('/auth/login')
        // this.WsChat.closeChatWs()
    }

    setSignInMethod(signInMethod: string): void {
        const user = this.getUser()
        user.sign_in_method = signInMethod
        this.setUser(user)
    }

    getCenter(): Center {
        const user: User = this.getUser()
        if (!_.isEmpty(user) && user.selected_center) {
            return user.selected_center
        } else {
            return {} as Center
        }
    }
    setCenter(center: Center): void {
        const user: User = this.getUser()
        user.selected_center = center
        this.setUser(user)
    }
    removeCenter(): void {
        const user: User = this.getUser()
        if (!_.isEmpty(user)) {
            user.selected_center = undefined
            this.setUser(user)
        }
    }

    setCenterUser(cu: CenterUser): void {
        const user: User = this.getUser()
        user.selected_center_user = cu
        this.setUser(user)
    }
    getCenterUser(): CenterUser {
        const user: User = this.getUser()
        if (!_.isEmpty(user) && !_.isEmpty(user.selected_center)) {
            return user.selected_center_user as CenterUser
        } else {
            return {} as CenterUser
        }
    }
    updateCenterUser(cu: CenterUser) {
        const centerUser = this.getCenterUser()
        if (!_.isEmpty(centerUser) && cu.id == centerUser.id) {
            this.setCenterUser(cu)
        }
    }
}
