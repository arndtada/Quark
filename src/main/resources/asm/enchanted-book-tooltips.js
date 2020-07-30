function injectForEachMethod(method, targetType, clazz, targetName, sig, callback) {
    var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');

    var target = ASM.findFirstMethodCall(method,
        targetType,
        clazz,
        targetName,
        sig);

    while (target !== null) {
        var index = method.instructions.indexOf(target);
        var indexShift = callback(target, index);

        var newIndex = method.instructions.indexOf(target);
        if (newIndex !== -1)
            index = newIndex;
        else if (typeof indexShift === 'number')
            index += indexShift;

        target = ASM.findFirstMethodCallAfter(method,
            targetType,
            clazz,
            targetName,
            sig,
            index + 1);
    }

    return method;
}

function initializeCoreMod() {
    return {
        'alter-placement-state': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.client.gui.screen.EnchantmentScreen',
                'methodName': 'render', // render
                'methodDesc': '(IIF)V'
            },
            'transformer': function (method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');
                var InsnNode = Java.type('org.objectweb.asm.tree.InsnNode');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');

                return injectForEachMethod(method,
                    ASM.MethodType.VIRTUAL,
                    "net/minecraft/client/gui/screen/EnchantmentScreen",
                    ASM.mapMethod("renderTooltip"), // renderTooltip
                    "(Ljava/util/List;II)V",
                    function (target) {
                        var newInstructions = new InsnList();

                        // LIi
                        newInstructions.add(new InsnNode(Opcodes.DUP2_X1));
                        // IiLIi
                        newInstructions.add(new InsnNode(Opcodes.POP2));
                        // IiL
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 8));
                        newInstructions.add(new VarInsnNode(Opcodes.ILOAD, 9));
                        newInstructions.add(ASM.buildMethodCall(
                            "vazkii/quark/base/handler/AsmHooks",
                            "captureEnchantingData",
                            "(Ljava/util/List;Lnet/minecraft/client/gui/screen/EnchantmentScreen;Lnet/minecraft/enchantment/Enchantment;I)Ljava/util/List;",
                            ASM.MethodType.STATIC
                        ));
                        // IiL
                        newInstructions.add(new InsnNode(Opcodes.DUP_X2));
                        // LIiL
                        newInstructions.add(new InsnNode(Opcodes.POP));
                        // LIi

                        method.instructions.insertBefore(target, newInstructions);
                    });
            }
        }
    }
}
