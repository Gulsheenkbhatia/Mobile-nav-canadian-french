import React, { useContext } from 'react'
import usePreference from 'toro/hooks/usePreference'
import PWAContext from 'components/common/PWAContext'
import get from 'lodash/get'
import Head from 'next/head'

export function Bambuser() {
  const { appData } = useContext(PWAContext)
  const siteId = get(appData, 'siteId')
  const isBambuserEnabled = usePreference({
    groupId: 'Bambuser',
    preferenceId: 'isEnabled',
    siteId: siteId,
    defaultValue: false,
  })
  const scriptSrc = usePreference({
    groupId: 'Bambuser',
    preferenceId: 'scriptSrc',
    siteId: siteId,
    defaultValue: '',
  })
  const liveStreamID = usePreference({
    groupId: 'Bambuser',
    preferenceId: 'liveStreamID',
    siteId: siteId,
    defaultValue: '',
  })

  const bambuserScript = `window.onBambuserLiveShoppingReady = player => {
                                player.configure({
                                buttons: {dismiss: player.BUTTON.MINIMIZE} }) 
                            }
                            (function(d, t, i, w) {
                                window.__bfwId = w;
                                if (d.getElementById(i) && window.__bfwInit)
                                    return window.__bfwInit(); 
                                if (d.getElementById(i))
                                    return;
                                var s, ss = d.getElementsByTagName(t)[0];
                                s = d.createElement(t); s.id = i;
                                s.setAttribute('defer','');
                                s.src = '${scriptSrc}';
                                ss.parentNode.insertBefore(s, ss);
                            })(document, 'script', 'bambuser-liveshopping-widget', '${liveStreamID}');`

  return (
    <>
      {isBambuserEnabled && (
        <Head>
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{ __html: bambuserScript }}
            key="bambuser-script"
            defer
          />
        </Head>
      )}
    </>
  )
}
