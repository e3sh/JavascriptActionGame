﻿// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。

//敵の動作シナリオ（ボスは別ファイル）
function sce_ememy_move_n(num1, num2) {
    //　出現後、まっすぐ進んだ後向き変更してしばらく後にさらに向き変更する
    //　途中でいろいろ弾打ったりするパターン　　
    //-----------------------------------------------------------------------

    this.init = function (scrn, o) {
        o.vset(1);
    }

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 80:
                o.get_target(98);
                break;
            case 90:
                //				o.vector = o.target_r( o.target.x, o.target.y );
                break;
            case 100:
                o.vector = o.target_v(); //o.vector = o.target_r( o.target.x, o.target.y );
                o.set_object(103);
                break;
            case 110:
                o.set_object(3);
                break;
            case 120:
                //o.set_object(4);
                o.vector += num1;
                o.vector = o.vector % 360;
                o.vset(1);
                break;
            case 140:
                //    o.set_object(103);
                break;
            case 160:
                o.vector = +num1;
                o.vector = o.vector % 360;
                o.vset(1);
                break;
            case 200:
                o.vector = +num1;
                o.vector = o.vector % 360;
                o.vset(1);
                o.frame = 50;
                break;
            default:
                break;
        }
        o.frame++;
        //o.frame++; //frame rate *2

        return o.sc_move();
    }
}

function sce_ememy_turn( num ){
    //　回りながら移動する敵の動き、途中弾撃つ
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(4);
    }

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 5:
//                o.set_object(3);
                o.set_object_ex(3, o.x, o.y, o.vector + Math.floor(Math.random() * 40) - 20, "exev_5expansion");
                break;
            case 15:
                o.vector += num;
                o.vset(4);
                break;
            case 25:
                o.vector += num;
                o.vset(4);
                break;
            case 35:
                o.vector += num;
                o.vset(4);
                break;
            case 45:
                o.frame = 1;
                break;
            default:
                break;
        }
        o.frame++;

        return o.sc_move();
    }
}

function sce_ememy_change_s() {
    //　まっすぐ下に降りて来ながらExevent1番実行した後、0.5秒後シナリオを9に変更
    //　ほぼ動作テスト用
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(4);
        o.vector = 180;
    }

    this.move = function (scrn, o) {

        if (o.frame == 15) {
            o.set_object(102);
            o.change_sce(9);
        }
        o.frame++;

        return o.sc_move();

    }
}

function sce_ememy_moveshot() {

    //移動しながら定期的に弾をばら撒いていく（その１）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(4);
    }

    this.move = function (scrn, o) {

        o.vset(4);

        if (o.vector > 180) { o.mp = 5; } else { o.mp = 4; }

        if (o.frame % 50 == 5) {
            //            o.set_object(12);
            if (o.frame > 3600) {
                o.set_object_ex(5, o.x, o.y, o.vector, "en_bullet_homing");
            } else {
                o.set_object_ex(5, o.x, o.y, o.vector, "en_bullet_turn");
            }
        }
        o.frame++;

        return o.sc_move();
    }
}

function sce_ememy_randomshot() {
    // ランダム弾用母機
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(4);
        o.w_cnt = 0;

        o.display_size = 1.5;

        o.hit_x *= 1.5;
        o.hit_y *= 1.5;

        o.hp = 20;
    }

    this.move = function (scrn, o) {

        if (o.vector > 180) { o.mp = 5; } else { o.mp = 4; }

        switch (o.frame) {
            case 10:
                o.vset(0);
                break;
            case 13:
                o.set_object(12);
                break;
            case 30:
                o.frame = 12;
                o.w_cnt++;
                break;
            default:
                break;
        };
        o.frame++;

        if (o.w_cnt > 5) {
            o.w_cnt = 0;
            //			o.vector = 170 + Math.floor( Math.random() * 20 );
            o.vset(2);
            o.frame = 0;
        }

        return o.sc_move();

    }
}

function sce_ememy_move_std(){
    //　出現後、まっすぐ進んだ後ぶつかったら向き変更
    //-----------------------------------------------------------------------

    this.init = function (scrn, o) {
        o.vset(2);
        o.wmapc = false;
        o.colcnt = 0;
    }

    this.move = function (scrn, o) {
        o.frame++;

        if (o.wmapc) {
            var v = (Math.floor(Math.random() * 2) == 0) ? 1 : 3;
            //o.vector = v;

            o.wmapc = false;

            o.vector += v*90;
            o.vector = o.vector % 360;

            o.vset(2);

            o.colcnt = 0;
        }

        if (o.vector > 180) { o.mp = 5; } else { o.mp = 4; }

        if (o.mapCollision) {
            o.colcnt++;
            if (o.colcnt > 10) o.wmapc = true;
        }

        /*
        if (o.frame > 90 + Math.floor(Math.random() * 4) * 60) {
        o.frame = 0;
        }
        */

        return o.sc_move();
    }
}

function sce_ememy_move_std2() {
    //　自機を追跡してくるパターン。
    //　60F毎に向き変更。
    //-----------------------------------------------------------------------

    this.init = function (scrn, o) {
        o.vset(2);
        o.wmapc = false;
        o.colcnt = 0;
        o.lockon_flag = false;
        o.growf = true;

        o.get_target(98);

       // o.pick_enable = false;
    }

    this.move = function (scrn, o) {
        o.frame++;

        if (o.growf) {
            if (o.mapCollision) o.mapCollision = false; ;
        }

        if (Boolean(o.target)) {
            if (o.target_d(o.target.x, o.target.y) < 200) { o.lockon_flag = true; }
        }

        if ((o.wmapc) && (o.lockon_flag)) {

            var v = o.target_v();

            var nv = 0;

            for (var i = 45; i < 320; i += 45) {

                if ((v > i - 22.5) && (v <= i + 22.5)) {
                    nv = i;
                }
            }

            o.vector = nv;
            o.vset(2);

            o.wmapc = false;

            o.colcnt = 0;
        }

        if (o.vector > 300) { o.mp = 5; } else { o.mp = 4; }

        if (o.mapCollision) {
            o.colcnt++;
            if (o.colcnt > 2) o.wmapc = true;
            //o.wmapc = true;
        }

        if (o.frame > 16) {

            if (o.lockon_flag) o.target_rotate_r(45);

            o.vset(2);

            o.frame = 0;
            o.get_target(98);

            o.growf = false;
        }

        //o.growf = false;

        return o.sc_move();
    }
}

function sce_ememy_generator() {
    //　敵機を吐き出してくるジェネレータ。
    //-----------------------------------------------------------------------

    this.init = function (scrn, o) {
        o.vset(0);
        o.gencnt = 0;
        o.lockon_flag = false;
        o.mp = 31; //絵だけ青ウニュウに
        o.hit_x = 8;
        o.hit_y = 8;

        o.get_target(98);
        o.hp = 18;
    }

    this.move = function (scrn, o) {
        o.frame++;

        if (Boolean(o.target)) {
            if (o.target_d(o.target.x, o.target.y) < 200) { o.lockon_flag = true; }
        }

        if (o.frame > 180) {

            if ((o.lockon_flag) && (o.gencnt < 5)) {
                var v = o.target_v();

                o.set_object_ex(1, o.x + o.Cos(v) * 32, o.y + o.Sin(v) * 32, v, "ememy_move_std2");
                o.gencnt++;
            }
            o.frame = 0;
            o.get_target(98);
            o.vset(0);
        }

        return o.sc_move();
    }
}

function sce_enemy_trbox() {
    //　宝箱用/動かない/当たり判定の都合上、敵にする。(別タイプを設定したら不要）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        //今の問題点（敵タイプなので誘爆で壊れてしまう）

        o.vset(0);

        o.attack = 0;//宝箱から攻撃くらったら困るので0
    }

    this.move = function (scrn, o) {
        var f = 0;

        o.frame++;

        // o.sc_moveを使えないので、（押しても動かさないため）直接記述

        if (this.status == 2) {//状態が衝突の場合
            this.change_sce(7);
            //this.sound.effect(8); //爆発音

            //入ってるアイテムを出す。
            for (var i = 0; i < this.pick.length; i++) {
                this.set_object_ex(this.pick[i], this.x, this.y, Math.floor(Math.random() * 360), "item_movingstop");
            }
            this.add_score(this.score);
        }

        if (this.damageflag) {
            var onst = this.gt.in_view_range(this.x - (this.hit_x / 2), this.y - (this.hit_y / 2), this.hit_x, this.hit_y);
            if (onst) {
                //this.sound.effect(12); //hit音
            }
        }

        if (this.status == 0) f = 1; //未使用ステータスの場合は削除

        // 移動処理はなし、押されても動かない。

        this.damageflag = false;

        return f;
    }
}
//TimeOverEnemy
function sce_ememy_timeover() {
    //　自機を目標にしてのホーミング移動(時間切れ）
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.vset(6);
        o.get_target(98);
        o.lifecount = 0;

        //o.cancelcol = flag;
        o.cancelcol = true;
        o.display_size = 2.0;

        o.hit_x *= 2.0;
        o.hit_y *= 2.0;

        o.attack = 10; //攻撃力

        o.pick_enable = false;
    }

    this.move = function (scrn, o) {

        switch (o.frame) {
            case 10:
                o.target_rotate_r(30);

                //if (o.vector > 180) { o.mp = 5; } else { o.mp = 4; }

                o.vset(6);
                break;
            case 15:
                o.get_target(98);
                o.frame = 9;
                break;
            default:
                break;
        }
        o.frame++;

        o.lifecount++;
        if ((o.lifecount % 300) == 250) {
            o.set_object_ex(5, o.x, o.y, o.vector, "en_bullet_homing");
        }

        if (o.cancelcol) this.mapCollision = false;

        return o.sc_move();
    }
}