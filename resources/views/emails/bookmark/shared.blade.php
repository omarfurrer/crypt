<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <!-- If you delete this meta tag, Half Life 3 will never be released. -->
        <meta name="viewport" content="width=device-width" />

        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Crypt</title>

    </head>

    <body bgcolor="#FFFFFF">

        <!-- HEADER -->
        <table class="head-wrap" bgcolor="#999999">
            <tr>
                <td></td>
                <td style="width: 85px;" class="header container" >

                    <div class="content">
                        <table bgcolor="#999999">
                            <tr>
                                <td>
                                    <a href="http://www.crypttt.com">
                                        <!--<img style="width: 100%" src="{{ public_path() }}/assets/images/logo.png" />-->
                                        <img style="width: 100%" src="http://www.crypttt.com/assets/images/logo.png" />
                                    </a>
                                </td>
                                <td align="right"><h6 style="color: white;font-size: 10px;" class="collapse">CRYPT</h6></td>
                            </tr>
                        </table>
                    </div>

                </td>
                <td></td>
            </tr>
        </table><!-- /HEADER -->


        <!-- BODY -->
        <table class="body-wrap">
            <tr>
                <td></td>
                <td class="container" bgcolor="#FFFFFF">

                    <div class="content">
                        <table>
                            <tr>
                                <td>
                                    <h3>Hi, <span style="text-transform: capitalize">{{ $sharedWith->f_name }}</span></h3>
                                    <p class="lead">
                                        <span style="text-transform: capitalize;font-weight: bold">{{ $sharedBy->f_name . ' ' . $sharedBy->l_name}}</span>
                                        has shared with you a bookmark on the 
                                        @if($bookmark->security_clearance == 0)
                                        <span style="font-weight:bold">Public</span>
                                        @endif
                                        @if($bookmark->security_clearance == 1)
                                        <span style="font-weight:bold">Private</span>
                                        @endif
                                        security level.</p>
                                    @if($bookmark->security_clearance == 1)
                                    <a style="font-size: 16px;text-decoration: none;" href="http://www.crypttt.com">Check it out! &raquo;</a>
                                    @else
                                    <a style="font-size: 16px;text-decoration: none;" href="{{ $bookmark->url }}">{{ $bookmark->custom_title != null ? $bookmark->custom_title : $bookmark->title }} &raquo;</a>
                                    @endif

                                    <!--                                    <div >
                                                                            <a href="http://www.crypttt.com">Visit Your Account</a>
                                                                        </div>-->
                                    </body>
                                    </html>