package cn.rongcloud.chatroomdemo.messageview;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.TextView;

import cn.rongcloud.chatroomdemo.R;
import cn.rongcloud.chatroomdemo.utils.DataInterface;
import io.rong.imlib.model.MessageContent;
import io.rong.message.ChatroomUserUnBan;

/**
 * Created by duanliuyi on 2018/6/20.
 */

public class UserUnBanView extends BaseMsgView {

    private TextView tvInfo;

    public UserUnBanView(Context context) {
        super(context);
        View view = LayoutInflater.from(getContext()).inflate(R.layout.msg_system_view, this);
        tvInfo = (TextView) view.findViewById(R.id.tv_info);
    }

    @Override
    public void setContent(MessageContent msgContent, String senderUserId) {
        if (msgContent instanceof ChatroomUserUnBan) {
            String id = ((ChatroomUserUnBan) msgContent).getId();
            String name = "";
            if (DataInterface.getUserInfo(id) != null) {
                name = DataInterface.getUserInfo(id).getName();
            } else {
                name = id;
            }
            tvInfo.setText("系统消息  " + name + "取消禁言");
        }

    }
}
