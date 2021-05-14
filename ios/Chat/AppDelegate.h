#import <UserNotifications/UNUserNotificationCenter.h>
#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>

// @interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>
@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>

// #import <UMCore/UMAppDelegateWrapper.h>
 
// @interface AppDelegate : UMAppDelegateWrapper <UIApplicationDelegate, RCTBridgeDelegate>
// @interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>


@property (nonatomic, strong) UIWindow *window;

@end
