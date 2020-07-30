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
                'class': 'net.minecraft.item.BlockItem',
                'methodName': 'func_195942_a', // tryPlace
                'methodDesc': '(Lnet/minecraft/item/BlockItemUseContext;)Lnet/minecraft/util/ActionResultType;'
            },
            'transformer': function (method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');

                return injectForEachMethod(method,
                    ASM.MethodType.VIRTUAL,
                    "net/minecraft/item/BlockItem",
                    ASM.mapMethod("func_195945_b"), // getStateForPlacement
                    "(Lnet/minecraft/item/BlockItemUseContext;)Lnet/minecraft/block/BlockState;",
                    function (target) {
                        var newInstructions = new InsnList();

                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 1));
                        newInstructions.add(ASM.buildMethodCall(
                            "vazkii/quark/base/handler/AsmHooks",
                            "alterPlacementState",
                            "(Lnet/minecraft/block/BlockState;Lnet/minecraft/item/BlockItemUseContext;)Lnet/minecraft/block/BlockState;",
                            ASM.MethodType.STATIC
                        ));

                        method.instructions.insert(target, newInstructions);
                    });
            }
        }
    }
}
