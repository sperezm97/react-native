#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>
// #import <UMCore/UMAppDelegateWrapper.h>
 
// @interface AppDelegate : UMAppDelegateWrapper <UIApplicationDelegate, RCTBridgeDelegate>
@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
